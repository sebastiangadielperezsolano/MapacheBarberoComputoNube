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
@PrimaryKeyJoinColumn(name = "id_usuario")
@Table(name = "cliente")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Cliente extends Usuario {

    @Lob
    @Column(name = "foto", columnDefinition = "LONGBLOB")
    private byte[] foto;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Turno> turnos = new ArrayList<>();

    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "id_barbero", nullable = true)
    @JsonIgnoreProperties({"turnos", "disponibilidades", "password"})
    private Barbero barbero;

    public Long getIdCliente() {
        return this.getIdUsuario();
    }

    public void setIdCliente(Long id) {
        this.setIdUsuario(id);
    }
}