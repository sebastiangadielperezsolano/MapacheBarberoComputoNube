package tecnm.equipo4.barberoApi.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(callSuper = true)
@PrimaryKeyJoinColumn(name = "idUsuario")
@Table(name = "barbero")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Barbero extends Usuario {

    @Column(nullable = false)
    private int experiencia;

    @Column(nullable = false)
    private String tituloRol;

    @OneToMany(mappedBy = "barbero", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Turno> turnos = new ArrayList<>();

    @OneToMany(mappedBy = "barbero", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<DisponibilidadBarbero> disponibilidades = new ArrayList<>();

    @JsonIgnore
    public Long getIdBarbero() {
        return this.getIdUsuario();
    }

    public void setIdBarbero(Long id) {
        this.setIdUsuario(id);
    }
}