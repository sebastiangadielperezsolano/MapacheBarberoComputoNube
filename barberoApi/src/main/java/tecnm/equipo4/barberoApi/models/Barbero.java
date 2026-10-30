package tecnm.equipo4.barberoApi.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "barbero")
public class Barbero {

    @Id
    @Column(name = "id_barbero")
    private Long idBarbero;

    @Column(name = "id_usuario")
    private Long idUsuario;

    @Column(name = "experiencia")
    private Integer experiencia;

    @Column(name = "titulo_rol")
    private String tituloRol;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_sucursal")
    private Sucursal sucursal;

    @OneToMany(mappedBy = "barbero", cascade = CascadeType.ALL)
    private List<Turno> turnos = new ArrayList<>();

    @OneToMany(mappedBy = "barbero", cascade = CascadeType.ALL)
    private List<DisponibilidadBarbero> disponibilidades = new ArrayList<>();
}