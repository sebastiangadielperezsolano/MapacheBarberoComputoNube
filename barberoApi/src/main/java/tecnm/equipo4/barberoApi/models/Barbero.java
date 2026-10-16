package tecnm.equipo4.barberoApi.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data

@Table (name = "barbero")
public class Barbero {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idBarbero;

    @Column(nullable = false)
    private int experiencia;

    @Column(nullable = false)
    private String tituloRol;

    @OneToMany(mappedBy = "barbero", cascade = CascadeType.ALL)
    private List<Turno> turnos = new ArrayList<>();

    @OneToMany(mappedBy = "barbero", cascade = CascadeType.ALL)
    private List<DisponibilidadBarbero> disponibilidades = new ArrayList<>();

    //relacion de muchos a 1, muchos clientes pueden tener un barbero
    @OneToMany(mappedBy = "barbero", cascade = CascadeType.ALL)
    private List<Cliente> clientes = new ArrayList<>();
}
